package com.example.expensetracker.repository;

import com.example.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Custom query method to find expenses by category
    List<Expense> findByCategoryIgnoreCase(String category);

    // Fetch all expenses sorted by date descending (newest first)
    List<Expense> findAllByOrderByDateDesc();
}
