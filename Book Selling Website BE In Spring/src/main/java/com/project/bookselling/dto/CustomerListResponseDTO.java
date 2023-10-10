package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerListResponseDTO {

    public int ID;
    public Long UserID;
    public String Role;
    public String UserName;
    public String FullName;
    public String EmailID;
    public String MobileNumber;
    public Boolean IsActive;
}
