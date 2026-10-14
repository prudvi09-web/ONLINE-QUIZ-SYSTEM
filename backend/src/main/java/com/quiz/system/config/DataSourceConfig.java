package com.quiz.system.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:h2:mem:quizdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE}")
    private String configuredUrl;

    @Value("${spring.datasource.username:sa}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = configuredUrl != null ? configuredUrl.trim() : "";
        String user = configuredUsername;
        String pass = configuredPassword;

        // Also check standard cloud DATABASE_URL if spring.datasource.url is default H2
        String envDbUrl = System.getenv("DATABASE_URL");
        if ((url.isEmpty() || url.contains("h2:mem")) && envDbUrl != null && !envDbUrl.isBlank()) {
            url = envDbUrl.trim();
        }

        // Auto-handle Aiven raw Service URI format: mysql://user:password@host:port/dbname?ssl-mode=REQUIRED
        if (url.startsWith("mysql://")) {
            try {
                URI uri = new URI(url);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    user = parts[0];
                    pass = parts[1];
                }
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 3306;
                String path = uri.getPath() != null && !uri.getPath().isEmpty() ? uri.getPath() : "/defaultdb";
                url = "jdbc:mysql://" + host + ":" + port + path + "?sslMode=REQUIRED&allowPublicKeyRetrieval=true";
                log.info("Successfully converted Aiven mysql:// URI to JDBC URL: jdbc:mysql://{}:{}{}", host, port, path);
            } catch (Exception e) {
                log.warn("Failed to parse mysql:// URI, prepending jdbc:", e);
                url = "jdbc:" + url;
            }
        } else if (url.startsWith("jdbc:mysql://")) {
            // Ensure essential SSL and auth parameters for Aiven cloud
            if (!url.contains("sslMode") && !url.contains("sslmode") && !url.contains("useSSL")) {
                url += (url.contains("?") ? "&" : "?") + "sslMode=REQUIRED";
            }
            if (!url.contains("allowPublicKeyRetrieval")) {
                url += (url.contains("?") ? "&" : "?") + "allowPublicKeyRetrieval=true";
            }
        }

        String maskedUrl = url.replaceAll(":[^/@]+@", ":****@");
        log.info("Connecting to database: {}", maskedUrl);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(user);
        config.setPassword(pass);
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        if (url.startsWith("jdbc:mysql:")) {
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        } else {
            config.setDriverClassName("org.h2.Driver");
        }

        return new HikariDataSource(config);
    }
}
