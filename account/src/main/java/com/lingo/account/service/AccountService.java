package com.lingo.account.service;

import com.lingo.account.model.Account;
import com.lingo.account.repository.AccountRepository;
import com.lingo.common_library.exception.NotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
  private AccountRepository accountRepository;

  public AccountService(AccountRepository accountRepository) {
    this.accountRepository = accountRepository;
  }

  public Account getAccount(String email){
    return this.accountRepository.findByEmail(email).orElseThrow(()-> new NotFoundException("Account not found for email", email));
  }

}
