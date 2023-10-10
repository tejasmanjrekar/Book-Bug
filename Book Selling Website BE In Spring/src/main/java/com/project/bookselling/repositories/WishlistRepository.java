package com.project.bookselling.repositories;

import com.project.bookselling.models.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishList, Long> {
    List<WishList> findAllByUserId(Long userId);
}
