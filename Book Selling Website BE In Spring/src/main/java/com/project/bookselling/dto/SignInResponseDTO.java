package com.project.bookselling.dto;

import com.project.bookselling.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class SignInResponseDTO {
    private boolean isSuccess;
    private String Message;
    private String Token;
    private User data;
}
