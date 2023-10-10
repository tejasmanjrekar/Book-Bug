package com.project.bookselling.repositories;

import com.project.bookselling.models.AddressDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressDetailsRepository extends JpaRepository<AddressDetails, Long> {
    Optional<AddressDetails> getAddressDetailsByUserID(Long userId);
    AddressDetails getSingleAddressDetailsByUserID(Long userId);
}
