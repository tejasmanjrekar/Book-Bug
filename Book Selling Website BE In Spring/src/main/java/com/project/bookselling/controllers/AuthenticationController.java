package com.project.bookselling.controllers;

import com.project.bookselling.dto.*;
import com.project.bookselling.models.AddressDetails;
import com.project.bookselling.models.CustomerDetails;
import com.project.bookselling.models.User;
import com.project.bookselling.repositories.AddressDetailsRepository;
import com.project.bookselling.repositories.CustomerDetailsRepository;
import com.project.bookselling.repositories.UserRepository;
import com.project.bookselling.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/Auth")
public class AuthenticationController {

    @Autowired
    JwtTokenUtil jwtTokenUtil;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CustomerDetailsRepository customerDetailsRepository;
    @Autowired
    AddressDetailsRepository addressDetailsRepository;

    @PostMapping("/SignUp")
    public ResponseEntity<BasicResponse> signUp(@RequestBody SignUpRequestDTO user) {
        Optional<User> cUser = userRepository.findByUserName(user.getUserName());
        if(cUser.isPresent()) {
            return new ResponseEntity<>(new BasicResponse(false, "User Already exists"), HttpStatus.OK);
        }
        if(!user.getPassword().equals(user.getConfigPassword())) {
            return new ResponseEntity<>(new BasicResponse(false, "Password and confirm password not matched"), HttpStatus.OK);
        }
        if(user.getRole().equalsIgnoreCase("admin") && !user.getMasterPassword().equals("India@123")) {
            return new ResponseEntity<>(new BasicResponse(false, "Wrong Master Password"), HttpStatus.OK);
        }
        User newUser = new User();
        newUser.setUserName(user.getUserName());
        newUser.setPassword(user.getPassword());
        newUser.setRole(user.getRole());
        newUser.setInsertionDate(new Date());
        newUser.setIsActive(true);
        userRepository.save(newUser);
        return new ResponseEntity<>(new BasicResponse(true, "User Registered"), HttpStatus.CREATED);
    }

    @PostMapping("/SignIn")
    public ResponseEntity<SignInResponseDTO> signIn(@RequestBody User user) throws NoSuchAlgorithmException {
        Optional<User> cUser = userRepository
                .findAll()
                .stream()
                .filter(u-> u.getUserName().equalsIgnoreCase(user.getUserName()) && u.getPassword().equals(user.getPassword()))
                .findFirst();
        if(!cUser.isEmpty()) {
            final String token = jwtTokenUtil.generateToken(user);
            return new ResponseEntity<>(new SignInResponseDTO(true,"Sign In Successfully" ,token, cUser.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new SignInResponseDTO(false,"Sign In Failed", null, null), HttpStatus.OK);
        }
    }

    @PostMapping("/AddCustomerDetail")
    public ResponseEntity<BasicResponse> addCustomerDetails(@RequestBody CustomerDetailsDTO customer)  {
        Optional<CustomerDetails> muCustomer = customerDetailsRepository.getCustomerDetailsByUserID( customer.getUserID() );
        if(!muCustomer.isEmpty()) {
            CustomerDetails customerDetails = customerDetailsRepository.getSingleCustomerDetailsByUserID(customer.getUserID());
            customerDetails.setFullName(customer.getFullName());
            customerDetails.setEmailID(customer.getEmailID());
            customerDetails.setMobileNumber(customer.getMobileNumber());
            customerDetails.setUpdateDate(new Date());
            customerDetailsRepository.save(customerDetails);
            return new ResponseEntity<>(new BasicResponse(true,"Update UserDetail Successfully"), HttpStatus.OK);
        } else {
            CustomerDetails cu = new CustomerDetails();
            cu.setEmailID(customer.getEmailID());
            cu.setInsertionDate(new Date());
            cu.setIsActive(true);
            cu.setFullName(customer.getFullName());
            cu.setUserName(customer.getUserName());
            cu.setUserID(customer.getUserID());
            cu.setMobileNumber(customer.getMobileNumber());
            customerDetailsRepository.save(cu);
            return new ResponseEntity<>(new BasicResponse(true, "Add UserDetail Successfully"), HttpStatus.OK);
        }
    }

    @GetMapping("/GetCustomerDetail")
    public ResponseEntity<BasicDataResponseDTO> getCustomerDetails(@RequestParam Long userId) {
        Optional<CustomerDetails> customerDetails = customerDetailsRepository.getCustomerDetailsByUserID(userId);
        if(customerDetails.isPresent()) {
            return new ResponseEntity<>(new BasicDataResponseDTO(true, "Customer Detail Found", customerDetails.get()), HttpStatus.OK);
        }
        return new ResponseEntity<>(new BasicDataResponseDTO(false, "Customer Detail Not found", null), HttpStatus.OK);
    }

    @PostMapping("/CustomerList")
    public ResponseEntity<AllItemResponse<CustomerListResponseDTO>> getCustomerList(@RequestBody PaginationRequestDTO page) {
        List<CustomerListResponseDTO> customerList = new ArrayList<>();
        List<User> customers= userRepository.findAll();
        //int Count = 1;
        customers.forEach(X->{
            //if(X.getRole().toLowerCase()=="customer") {
                CustomerListResponseDTO data = new CustomerListResponseDTO();
                //data.ID = Count;
                data.Role = X.getRole().toLowerCase();
                data.UserName = X.getUserName();
                CustomerDetails customerDetails = customerDetailsRepository.getSingleCustomerDetailsByUserID(X.getUserId());
                if (customerDetails != null) {
                    data.FullName = customerDetails.getFullName();
                    data.EmailID = customerDetails.getEmailID();
                    data.MobileNumber = customerDetails.getMobileNumber();
                    data.IsActive = customerDetails.getIsActive();
                }
                customerList.add(data);
                //Count=Count+1;
            //}
        });
        return new ResponseEntity<>(new AllItemResponse<>(true, customerList.stream().count()==0?"Customer Data Not found":"Customer Data Found", customerList),HttpStatus.OK);
        //return new ResponseEntity<>(new AllItemResponse<>(true, customers.stream().count()==0?"Not found":"Customer Data Found", customers),customers.stream().count()==0? HttpStatus.NOT_FOUND:HttpStatus.OK);
    }

    @PostMapping("/AddCustomerAdderess")
    public ResponseEntity<BasicResponse> addCustomerDetails(@RequestBody AddressRequestDTO address)  {
        Optional<AddressDetails> muAddress = addressDetailsRepository.getAddressDetailsByUserID( address.getUserID() );
        if(!muAddress.isEmpty()) {
            AddressDetails addressDetails = addressDetailsRepository.getSingleAddressDetailsByUserID(address.getUserID());
            addressDetails.setAddress1(address.getAddress1());
            addressDetails.setCity(address.getCity());
            addressDetails.setDistict(address.getDistict());
            addressDetails.setCountry(address.getCountry());
            addressDetails.setAddress2(address.getAddress2());
            addressDetails.setState(address.getState());
            addressDetails.setPincode(address.getPincode());
            addressDetailsRepository.save(addressDetails);
            return new ResponseEntity<>(new BasicResponse(false,"Update Address Successfully"), HttpStatus.OK);
        } else {
            AddressDetails cu = new AddressDetails();
           cu.setUserID(address.getUserID());
           cu.setAddress1(address.getAddress1());
           cu.setAddress2(address.getAddress2());
           cu.setCity(address.getCity());
           cu.setDistict(address.getDistict());
           cu.setState(address.getState());
           cu.setPincode(address.getPincode());
           cu.setCountry(address.getCountry());
           cu.setIsActive(true);
            addressDetailsRepository.save(cu);
            return new ResponseEntity<>(new BasicResponse(true, "Address Added Successfully"), HttpStatus.OK);
        }
    }

    @GetMapping("/GetCustomerAdderess")
    public ResponseEntity<BasicDataResponseDTO> getAddressDetails(@RequestParam Long userId) {
        Optional<AddressDetails> addressDetails = addressDetailsRepository.getAddressDetailsByUserID(userId);
        if(addressDetails.isPresent()) {
            return new ResponseEntity<>(new BasicDataResponseDTO(true, "Customer Address Found", addressDetails.get()), HttpStatus.OK);
        }
        return new ResponseEntity<>(new BasicDataResponseDTO(false, "Customer Address Not found", null), HttpStatus.OK);
    }

}
