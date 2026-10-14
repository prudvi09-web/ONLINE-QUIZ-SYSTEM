# ===================================================================
# Multi-stage Dockerfile: Full-Stack Online Quiz System
# Combines React Frontend + Spring Boot Backend into 1 Live Service
# ===================================================================

# --- Stage 1: Build React Frontend ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Spring Boot Backend with embedded Frontend ---
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend

COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

COPY backend/src ./src

# Embed compiled React frontend into Spring Boot static directory
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static/

RUN mvn clean package -DskipTests

# --- Stage 3: Lightweight Production Runtime Image ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
