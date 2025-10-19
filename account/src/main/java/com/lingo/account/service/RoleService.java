package com.lingo.account.service;

import com.lingo.account.config.KeycloakPropsConfig;
import com.lingo.account.model.Account;
import com.lingo.account.model.Role;
import com.lingo.account.repository.AccountRepository;
import com.lingo.account.repository.RoleRepository;
import com.lingo.account.utils.KeycloakUtils;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleService {
  private final Keycloak keycloak;
  private final KeycloakPropsConfig keycloakPropsConfig;
  private final RoleRepository roleRepository;
  private final AccountRepository accountRepository;

  public void assignRole(String userId, String roleName) {
    try {
      if (keycloak.tokenManager().getAccessToken() == null) {
        log.error("Keycloak token is null. Authentication failed.");
        throw new RuntimeException("Keycloak authentication failed - no access token");
      }

      RealmResource realmResource = keycloak.realm(keycloakPropsConfig.getRealm());

      UserResource userResource = realmResource.users().get(userId);

      RoleRepresentation guestRealmRole = realmResource.roles().get(roleName).toRepresentation();
      if (guestRealmRole == null) {
        throw new RuntimeException("Role not found: " + roleName);
      }

      userResource.roles().realmLevel().add(Collections.singletonList(guestRealmRole));


      log.info("KEYCLOAK, User {} assigned role {}", userId, guestRealmRole.getName());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public void unAssignRole(String userId, String roleName) {
    try {
      if (keycloak.tokenManager().getAccessToken() == null) {
        log.error("Keycloak token is null. Authentication failed.");
        throw new RuntimeException("Keycloak authentication failed - no access token");
      }

      RealmResource realmResource = keycloak.realm(keycloakPropsConfig.getRealm());

      UserResource userResource = realmResource.users().get(userId);

      RoleRepresentation guestRealmRole = realmResource.roles().get(roleName).toRepresentation();
      if (guestRealmRole == null) {
        throw new RuntimeException("Role not found: " + roleName);
      }

      userResource.roles().realmLevel().remove(Collections.singletonList(guestRealmRole));


      log.info("KEYCLOAK, User {} assigned role {}", userId, guestRealmRole.getName());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Transactional
  public void assignRoleToAccount(String userId, String roleName) {
    Account account = (Account) accountRepository.findByKeycloakId(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));

    assignRole(userId, roleName);

    Role roleToAdd = roleRepository.findByName(roleName);
    if (roleToAdd == null) {
      throw new RuntimeException("Role not found in database: " + roleName);
    }

    Collection<Role> currentRoles = account.getRoles();

    if (currentRoles == null || currentRoles.isEmpty()) {
      account.setRoles(new ArrayList<>(Arrays.asList(roleToAdd)));
    } else {
      if (!currentRoles.contains(roleToAdd)) {
        List<Role> rolesList = new ArrayList<>(currentRoles);
        rolesList.add(roleToAdd);
        account.setRoles(rolesList);
      }
    }
    accountRepository.save(account);
  }

  @Transactional
  public void unAssignRoleToAccount(String userId, String roleName) {
    Account account = (Account) this.accountRepository.findByKeycloakId(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));
    unAssignRole(userId, roleName);

    Role role = roleRepository.findByName(roleName);
    if (role != null) {
      account.getRoles().remove(role);
      this.accountRepository.save(account);
    }

  }



}