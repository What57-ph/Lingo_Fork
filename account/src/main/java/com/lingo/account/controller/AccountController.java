package com.lingo.account.controller;

import com.lingo.account.model.Account;
import com.lingo.account.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {
  private AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/{email}")
  @Operation(summary = "Find user by email", description = "Return 200 if the user exists.")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "User found", content = @Content(mediaType = "application/json")),
          @ApiResponse(responseCode = "400", description = "Wrong/not valid email", content = @Content(mediaType = "application/json")),
  })
  public Account getAccount(@PathVariable String email){
    return this.accountService.getAccount(email);
  }
}
