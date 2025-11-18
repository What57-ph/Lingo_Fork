package com.lingo.chatbot.service;

import com.lingo.chatbot.httpClient.NotifyClient;
import com.lingo.chatbot.model.ChatbotNotifyInput;
import com.lingo.common_library.dto.ReqNotificationPost;
import com.lingo.common_library.dto.ResNotification;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationProvidedService {
    NotifyClient notifyClient;

    @Tool(name = "notifyUser", description = "Send notification to user and read json file to detect notification type name and notification type id, if send to specific user and require userId, instruct user find userId in admin page")
    public ResNotification notifyUser(ReqNotificationPost input) throws IOException {
        ClassPathResource classPathResource = new ClassPathResource("instructions/notification-type.json");
        File file = classPathResource.getFile();
        String content= new String(java.nio.file.Files.readAllBytes(file.toPath()));

        return notifyClient.createNotification(input).getBody();
    }


}
