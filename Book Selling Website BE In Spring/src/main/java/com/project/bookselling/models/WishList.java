package com.project.bookselling.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
public class WishList {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long wishListID;
    @Column(nullable = false)
    private Long userId;
    @Column(insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date insertionDate;
    private Long productID;
    @Column(columnDefinition = "boolean default true")
    private Boolean isActive;
	public Long getWishListID() {
		return wishListID;
	}
	public void setWishListID(Long wishListID) {
		this.wishListID = wishListID;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Date getInsertionDate() {
		return insertionDate;
	}
	public void setInsertionDate(Date insertionDate) {
		this.insertionDate = insertionDate;
	}
	public Long getProductID() {
		return productID;
	}
	public void setProductID(Long productID) {
		this.productID = productID;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
    
    
}
