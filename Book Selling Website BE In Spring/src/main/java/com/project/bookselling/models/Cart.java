package com.project.bookselling.models;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long cardID;
    @Column(nullable = false)
    private Long userId;
    @Column(insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date insertionDate;
    @Column(nullable = false)
    private Long productID;
    @Column(columnDefinition = "boolean default false")
    private Boolean isOrder;
    @Column(columnDefinition = "boolean default true")
    private Boolean isActive;
    private Boolean isPayment;
    private double Rating=0.0;
    private String PaymentType;
    private String CardNo;
    private String UpiId;
	public Long getCardID() {
		return cardID;
	}
	public void setCardID(Long cardID) {
		this.cardID = cardID;
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
	public Boolean getIsOrder() {
		return isOrder;
	}
	public void setIsOrder(Boolean isOrder) {
		this.isOrder = isOrder;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	public Boolean getIsPayment() {
		return isPayment;
	}
	public void setIsPayment(Boolean isPayment) {
		this.isPayment = isPayment;
	}
	public double getRating() {
		return Rating;
	}
	public void setRating(double rating) {
		Rating = rating;
	}
	public String getPaymentType() {
		return PaymentType;
	}
	public void setPaymentType(String paymentType) {
		PaymentType = paymentType;
	}
	public String getCardNo() {
		return CardNo;
	}
	public void setCardNo(String cardNo) {
		CardNo = cardNo;
	}
	public String getUpiId() {
		return UpiId;
	}
	public void setUpiId(String upiId) {
		UpiId = upiId;
	}
    
    
}
