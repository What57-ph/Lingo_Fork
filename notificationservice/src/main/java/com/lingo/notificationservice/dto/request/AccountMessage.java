package com.lingo.notificationservice.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountMessage {
  String userId; 
  String email;
  String username;
}
