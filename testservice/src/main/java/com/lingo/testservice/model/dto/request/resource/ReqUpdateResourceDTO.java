package com.lingo.testservice.model.dto.request.resource;

import jakarta.annotation.Nullable;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@EqualsAndHashCode(callSuper = true)
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReqUpdateResourceDTO extends ReqMediaResourceDTO{
    @Nullable
    long testId;
    @Nullable
    long questionId;
}
