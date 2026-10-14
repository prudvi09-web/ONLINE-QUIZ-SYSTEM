FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy maven dependencies
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source (includes pre-compiled React frontend in src/main/resources/static)
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Production Alpine JRE image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Xss512k", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
