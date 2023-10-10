package com.project.bookselling.controllers;

import com.project.bookselling.dto.*;
import com.project.bookselling.models.Feedback;
import com.project.bookselling.models.User;
import com.project.bookselling.repositories.FeedbackRepository;
import com.project.bookselling.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/Feedback")
public class FeedbackController {
    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/GetFeedbacks")
    public ResponseEntity<AllItemResponse<GetFeedbackResponse>> getFeedbacks(@RequestBody PaginationRequestDTO page) {
        List<GetFeedbackResponse> response = new ArrayList<>();
        List<Feedback> feedbacks = feedbackRepository.findAll();
        feedbacks.forEach(X->{
            User data = userRepository.getReferenceById(X.getUserId());
            if(data != null) {
                GetFeedbackResponse feedbackData = new GetFeedbackResponse();
                feedbackData.setFeedbackId(X.getFeedbackId());
                feedbackData.setFeedback(X.getFeedback());
                feedbackData.setUserName(data.getUserName());
                response.add(feedbackData);
            }
        });
        return new ResponseEntity<>(new AllItemResponse<>(true, response.stream().count()==0?"Feedbacks Not Found":"Feedbacks Found", response), HttpStatus.OK);
    }

    @PostMapping("/AddFeedback")
    public ResponseEntity<BasicDataResponseDTO<List<Feedback>>> createFeedback( @RequestBody FeedbackDTO feedback) {
        Feedback f = new Feedback();
        f.setFeedback(feedback.getFeedback());
        f.setUserId(feedback.getUserId());
        feedbackRepository.save(f);
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Send Feedback Successfully", null), HttpStatus.OK);
    }

    @DeleteMapping("/DeleteFeedback")
    public ResponseEntity<BasicDataResponseDTO<List<Feedback>>> deleteFeedback( @RequestParam Long feedbackId) {
        feedbackRepository.deleteById(feedbackId);
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Delete Feedback Successfully", null), HttpStatus.OK);
    }
}
