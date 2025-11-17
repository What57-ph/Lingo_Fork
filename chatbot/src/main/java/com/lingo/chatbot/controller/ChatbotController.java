package com.lingo.chatbot.controller;

import com.lingo.chatbot.model.ChatRequest;
import com.lingo.chatbot.service.ChatbotService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.ai.chat.messages.Message;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "Chatbot API", description = "Endpoints to interact with AI chatbot with text and media messages")
public class ChatbotController {

    final ChatbotService chatbotService;

    @Operation(
            summary = "Send text to AI chatbot",
            description = "Send a text message to the AI chatbot and receive a response."
    )
    @PostMapping("/askAI")
    public ResponseEntity<String> chat(@RequestBody ChatRequest chatRequest){
        return ResponseEntity.ok(chatbotService.chat(chatRequest));
    }

    @Operation(
            summary = "Send media with text to AI chatbot",
            description = "Send a message along with a media file (audio, image, or video) to the AI chatbot."
    )
    @PostMapping("/chat-with-media")
    public ResponseEntity<String> chatWithMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("message") String message,
            @RequestParam("userId") String userId) {
        return ResponseEntity.ok(chatbotService.chatWithMedia(file, message, userId));
    }

    @Operation(
            summary = "Get conversation messages",
            description = "Retrieve the list of messages in a conversation by conversation ID."
    )
    @GetMapping("/conversation/{id}")
    public ResponseEntity<List<Message>> getConversationMessages(@PathVariable("id") String id){
        return ResponseEntity.ok(chatbotService.getConversationMessage(id));
    }

}
