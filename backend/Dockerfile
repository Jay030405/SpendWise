# =========================
# Stage 1: Build
# =========================

FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o spendwise-backend .


# =========================
# Stage 2: Production
# =========================

FROM alpine:3.22

WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# Copy application binary
COPY --from=builder /app/spendwise-backend .

# Give ownership to the non-root user
RUN chown appuser:appgroup /app/spendwise-backend

# Switch from root to non-root user
USER appuser

EXPOSE 8080

CMD ["./spendwise-backend"]