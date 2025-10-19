package com.lingo.account.service;

import com.lingo.account.config.KeycloakPropsConfig;
import com.lingo.account.dto.identity.ReqAccount;
import com.lingo.account.dto.identity.TokenExchangeRequest;
import com.lingo.account.dto.request.ReqAccountDTO;
import com.lingo.account.dto.request.ReqAccountGGDTO;
import com.lingo.account.dto.request.ReqUpdateAccountDTO;
import com.lingo.account.dto.response.ResAccountDTO;
import com.lingo.account.dto.response.ResPaginationDTO;
import com.lingo.account.mapper.AccountMapper;
import com.lingo.account.model.Account;
import com.lingo.account.model.Role;
import com.lingo.account.repository.AccountRepository;
import com.lingo.account.repository.IdentityClient;
import com.lingo.account.repository.RoleRepository;
import com.lingo.account.utils.Constants;
import com.lingo.common_library.exception.CreateUserException;
import com.lingo.common_library.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {
  private final AccountRepository accountRepository;
  private final IdentityClient identityClient;
  private final AccountMapper accountMapper;
  private final RoleService roleService;
  private final RoleRepository roleRepository;
  private final Keycloak keycloak;
  private final KeycloakPropsConfig keycloakPropsConfig;
  private final String USER = "USER";

  @Value("${idp.client-id}")
  @NonFinal
  String clientId;

  @Value("${idp.client-secret}")
  @NonFinal
  String clientSecret;

  public ResAccountDTO createNewAccount(ReqAccountDTO request) throws CreateUserException{

    if (this.accountRepository.findByUsername(request.getUsername()).isPresent()){
      throw new CreateUserException(Constants.ErrorCode.USER_NAME_ALREADY_EXITED);
    }

    if (this.accountRepository.findByEmail(request.getUsername()).isPresent()){
      throw new CreateUserException(Constants.ErrorCode.EMAIL_ALREADY_EXITED);
    }

      var createAccountRes = identityClient.createAccount(
              "Bearer " + getClientToken(),
              ReqAccount.builder()
                      .username(request.getUsername())
                      .firstName(request.getFirstName())
                      .lastName(request.getLastName())
                      .email(request.getEmail())
                      .enabled(true)
                      .emailVerified(false)
                      .credentials(List.of(ReqAccount.Credential.builder()
                              .type("password")
                              .temporary(false)
                              .value(request.getPassword())
                              .build()))
                      .build());

      String userId = extractUserId(createAccountRes);
      this.roleService.assignRole(userId, USER); // assign in keycloak
      log.info("KEYCLOAK, User created with id: {}", userId);

      Account account = accountMapper.toModel(request, userId);
      account.setRoles(Arrays.asList(roleRepository.findByName(USER)));
      this.accountRepository.save(account);

      return accountMapper.toResDTO(account);

  }

  public ResAccountDTO getAccount(String id) throws NotFoundException {
    Account account = (Account) this.accountRepository.findByKeycloakId(id)
            .orElseThrow(() -> new NotFoundException(Constants.ErrorCode.USER_NOT_FOUND));
    return accountMapper.toResDTO(account);
  }

  public ResPaginationDTO getAllAccounts(Specification<Account> spec, Pageable pageable) {
    Page<Account> pOrder = this.accountRepository.findAll(spec, pageable);

    ResPaginationDTO res = new ResPaginationDTO();
    ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();

    meta.setPage(pageable.getPageNumber());
    meta.setPageSize(pageable.getPageSize());

    meta.setPages(pOrder.getTotalPages());
    meta.setTotal(pOrder.getTotalElements());

    res.setMeta(meta);

    res.setResult(pOrder.getContent().stream().map(accountMapper::toResDTO).toList());

    return res;
  }

  public void deleteAccount(String id) {
    updateEnableAccount(id, false);
  }

  public void restoreAccount(String id) {
    updateEnableAccount(id, true);
  }

  public ResAccountDTO updateAccount(ReqUpdateAccountDTO request) {
    Account account = this.accountRepository.findById(request.getId())
            .orElseThrow(() -> new NotFoundException(Constants.ErrorCode.USER_NOT_FOUND));

    account.setFirstName(request.getFirstName());
    account.setLastName(request.getLastName());
    account.setUsername(request.getUsername());
    this.accountRepository.save(account);

    return accountMapper.toResDTO(account);
  }

  public Account updateEnableAccount(String id, boolean enable) {
    UserRepresentation userRepresentation =
            keycloak.realm(keycloakPropsConfig.getRealm()).users().get(id).toRepresentation();
    Account account = (Account) this.accountRepository.findByKeycloakId(id)
            .orElseThrow(() -> new NotFoundException(Constants.ErrorCode.USER_NOT_FOUND));

    if (userRepresentation != null) {
      RealmResource realmResource = keycloak.realm(keycloakPropsConfig.getRealm());
      UserResource userResource = realmResource.users().get(id);
      userRepresentation.setEnabled(enable);
      userResource.update(userRepresentation);

      account.setEnable(enable);
      return this.accountRepository.save(account);
    } else {
      throw new NotFoundException(Constants.ErrorCode.USER_NOT_FOUND);
    }
  }

  public ResAccountDTO createAccountGG(ReqAccountGGDTO req) {
    return this.accountRepository.findByEmail(req.getEmail())
            .map(existingAccount -> {
              log.info("Account with email {} already exists, returning existing account", req.getEmail());
              return accountMapper.toResDTO(existingAccount);
            })
            .orElseGet(() -> {
              Account account = new Account();
              account.setEmail(req.getEmail());
              account.setKeycloakId(req.getSub());
              account.setEnable(true);
              account.setUsername(req.getEmail());
              this.accountRepository.save(account);
              this.roleService.assignRole(req.getSub(), USER); // assign in keycloak
              log.info("Created new account for email {}", req.getEmail());
              return accountMapper.toResDTO(account);
            });
  }


  private String extractUserId(ResponseEntity<?> response) {
    List<String> locations = response.getHeaders().get("Location");
    if (locations == null || locations.isEmpty()) {
      throw new IllegalStateException("Location header is missing in the response");
    }

    String location = locations.get(0);
    String[] splitedStr = location.split("/");
    return splitedStr[splitedStr.length - 1];
  }

  private String getClientToken() {
    TokenExchangeRequest newToken = new TokenExchangeRequest("client_credentials", clientId, clientSecret, "openid");

    var token = this.identityClient.exchangeClientToken(newToken);
    return token.getAccessToken();
  }
}
