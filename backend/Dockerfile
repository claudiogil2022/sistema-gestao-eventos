# Dockerfile na raiz da pasta 'events' (onde está o pom.xml)

# Estágio 1: Build da aplicação (usando uma imagem base Maven)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Define o locale para garantir que o ambiente de build use UTF-8
ENV LANG C.UTF-8

COPY pom.xml .
COPY src ./src
# Pula os testes para um build mais rápido no Dockerfile (opcional, mas recomendado para builds de imagem)
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Estágio 2: Criação da imagem final (usando uma imagem base menor, JRE)
FROM eclipse-temurin:17-jre-focal
# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Define o locale também no estágio final, embora o problema seja provavelmente no build
ENV LANG C.UTF-8

# Copia o JAR da aplicação do estágio de build para o estágio final
COPY --from=build /app/target/*.jar app.jar
# Expõe a porta que sua aplicação Spring Boot usa
EXPOSE 8080
# Comando para rodar a aplicação quando o contêiner iniciar
ENTRYPOINT ["java", "-jar", "app.jar"]
