# Etapa de compilación (usando la arquitectura nativa del runner)
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG TARGETARCH
WORKDIR /src
COPY ["MyFirstApi.csproj", "."]
RUN dotnet restore "MyFirstApi.csproj"
COPY . .
WORKDIR "/src/."

# Diagnóstico temporal
RUN echo "=== Archivos de DataContext ===" \
    && find /src -iname '*datacontext*'

RUN echo "=== Contenido de DataContext ===" \
    && cat /src/Data/DataContext.cs

RUN dotnet publish "MyFirstApi.csproj" -c Release -o /app/publish -a $TARGETARCH --self-contained false

# Etapa de ejecución (esta sí será ARM64)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MyFirstApi.dll"]