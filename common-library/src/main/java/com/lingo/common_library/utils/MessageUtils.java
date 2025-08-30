package com.lingo.common_library.utils;

import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;

import java.util.Locale;
import java.util.ResourceBundle;

public class MessageUtils {
  private static final ResourceBundle messageBundle = ResourceBundle.getBundle("messages.messages", Locale.getDefault());

  public static String getMessage(String errorCode, Object... var) {
    String message ;
    try {
      message = messageBundle.getString(errorCode);
    } catch (Exception e) {
      message = errorCode;
    }
    FormattingTuple formattingTuple = MessageFormatter.arrayFormat(message, var);
    return formattingTuple.getMessage();
  }
}
