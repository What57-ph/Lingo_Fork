package com.lingo.account.service;

import com.lingo.account.dto.request.RequestMailDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", url = "${con.notify.url}", path = "/notification")
public interface NotifyClient {

  @PostMapping
  ResponseEntity<String> sendMailCode(@RequestBody RequestMailDTO request);
}
