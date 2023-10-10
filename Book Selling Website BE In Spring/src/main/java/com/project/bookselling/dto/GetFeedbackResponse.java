package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetFeedbackResponse {
    private Long FeedbackId;
    private String UserName;
    private String feedback;
}
