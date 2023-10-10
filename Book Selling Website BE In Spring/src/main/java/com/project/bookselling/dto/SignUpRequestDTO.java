package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class SignUpRequestDTO {
    private String userName;
    private String password;
    private String configPassword;
    private String masterPassword;
    private String role;
}
