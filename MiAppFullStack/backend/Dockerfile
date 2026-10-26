# Stage 1: Builder
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS builder

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish




# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app

COPY --from=builder /app/publish .


# Puerto corregido para compatibilidad con las imágenes de .NET 10
EXPOSE 8080

ENTRYPOINT ["dotnet", "MyFirstApi.dll"]
