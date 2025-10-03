package com.lingo.testservice.repository;

import com.lingo.testservice.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TestRepository extends JpaRepository<Test, Long>, JpaSpecificationExecutor<Test> {

    Optional<Test> findTopByTitle(String tittle);
}
