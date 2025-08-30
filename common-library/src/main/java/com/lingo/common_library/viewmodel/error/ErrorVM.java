package com.lingo.common_library.viewmodel.error;

import java.util.ArrayList;
import java.util.List;

public record ErrorVM(String statusCode, String title, String detail, List<String> fieldError) {
  public ErrorVM(String statusCode, String title, String detail) {
    this(statusCode, title, detail, new ArrayList<>());
  }
}
