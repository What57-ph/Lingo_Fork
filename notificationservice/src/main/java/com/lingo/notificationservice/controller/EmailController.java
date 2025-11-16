package com.lingo.notificationservice.controller;

import com.lingo.notificationservice.dto.request.RequestMailDTO;
import com.lingo.notificationservice.service.EmailService;
import com.lingo.notificationservice.utils.Constants;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class EmailController {

  private final EmailService emailService;

  @PostMapping
  public ResponseEntity<String> sendMailCode(@RequestBody RequestMailDTO request) throws MessagingException {
    log.info("Sending mail to {}", request.getTo());
    this.emailService.sendOTPCode(request);
    return ResponseEntity.ok("Mail sent successfully");
  }
}
