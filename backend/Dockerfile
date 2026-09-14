# =========================
# Stage 1: Build
# =========================

FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copy Go dependency files first
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source code
COPY . .

# Build the Go application
RUN go build -o spendwise-backend .


# =========================
# Stage 2: Run
# =========================

FROM alpine:latest

WORKDIR /app

# Copy compiled application
COPY --from=builder /app/spendwise-backend .

# Run the application
CMD ["./spendwise-backend"]