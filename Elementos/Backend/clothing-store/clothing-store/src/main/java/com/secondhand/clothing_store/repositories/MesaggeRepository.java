package com.secondhand.clothing_store.repositories;

import com.secondhand.clothing_store.models.Mesagge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MesaggeRepository extends JpaRepository<Mesagge, Long> {}
