package com.lingo.account.service;

import com.lingo.account.dto.request.RequestMailDTO;
import com.lingo.account.utils.Constants;
import com.lingo.common_library.exception.OtpException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public interface OtpService {

  String generateOtp();

  void sendOtp(String email, String OTP);

  boolean verifyOtp(String email, String OTP);

  boolean isOtpPresent(String email);
}

@Service
@Slf4j
@RequiredArgsConstructor
class OtpServiceImpl implements OtpService {

  private final RedisTemplate<String, Object> redisTemplate;
  private final NotifyClient notifyClient;

  /**
   * {@inheritDoc}
   */
  @Override
  public String generateOtp() {
    StringBuilder otp = new StringBuilder();
    Random random = new Random();
    for (int i = 0; i < Constants.Value.OTP_LENGTH; i++) {
      otp.append(random.nextInt(10));
    }
    log.info("Generated OTP: {}", otp);
    return otp.toString();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void sendOtp(String email, String OTP) {
    redisTemplate.opsForValue().set(email, OTP, Duration.ofMinutes(Constants.Value.OTP_MINUTES));
    try {
      RequestMailDTO requestMailDTO = new RequestMailDTO(email, OTP);
      ResponseEntity<String> response = this.notifyClient.sendMailCode(requestMailDTO);
      log.info("Response from notify client: {}", response.getBody());
      log.info("Storing OTP {} to {} ", OTP, email);
    } catch (Exception e) {
      redisTemplate.delete(email);
      log.error("Failed to send OTP {} to {}", OTP, email, e);
      throw new RuntimeException(e);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean verifyOtp(String email, String OTP) throws OtpException {
    String otp = (String) redisTemplate.opsForValue().get(email);
    if(otp == null){
      throw new OtpException(Constants.ErrorCode.OTP_EXPIRATION);
    } else if (!otp.equals(OTP)) {
      throw new OtpException(Constants.ErrorCode.OTP_INVALID);
    } else {
      redisTemplate.delete(email);
      log.info("Deleting OTP {} from {} ", OTP, email);
      return true;
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean isOtpPresent(String email) {
    return redisTemplate.hasKey(email);
  }
}
