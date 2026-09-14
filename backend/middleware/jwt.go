package middleware

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID int `json:"user_id"`

	jwt.RegisteredClaims
}

func GenerateToken(userID int) (string, error) {
	secret := os.Getenv("JWT_SECRET")

	if secret == "" {
		return "", errors.New(
			"JWT_SECRET is not configured",
		)
	}

	claims := Claims{
		UserID: userID,

		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(
				time.Now().Add(24 * time.Hour),
			),

			IssuedAt: jwt.NewNumericDate(
				time.Now(),
			),
		},
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	return token.SignedString(
		[]byte(secret),
	)
}

func ValidateToken(
	tokenString string,
) (*Claims, error) {

	secret := os.Getenv("JWT_SECRET")

	if secret == "" {
		return nil, errors.New(
			"JWT_SECRET is not configured",
		)
	}

	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {

			if token.Method != jwt.SigningMethodHS256 {
				return nil, errors.New(
					"unexpected signing method",
				)
			}

			return []byte(secret), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)

	if !ok || !token.Valid {
		return nil, errors.New(
			"invalid token",
		)
	}

	return claims, nil
}

func AuthMiddleware(
	next http.Handler,
) http.Handler {

	return http.HandlerFunc(
		func(
			w http.ResponseWriter,
			r *http.Request,
		) {

			authHeader :=
				r.Header.Get("Authorization")

			if authHeader == "" {
				http.Error(
					w,
					"Authorization header is required",
					http.StatusUnauthorized,
				)

				return
			}

			parts :=
				strings.SplitN(
					authHeader,
					" ",
					2,
				)

			if len(parts) != 2 ||
				parts[0] != "Bearer" {

				http.Error(
					w,
					"Invalid authorization format",
					http.StatusUnauthorized,
				)

				return
			}

			tokenString := parts[1]

			claims, err :=
				ValidateToken(tokenString)

			if err != nil {
				http.Error(
					w,
					"Invalid or expired token",
					http.StatusUnauthorized,
				)

				return
			}

			r = r.WithContext(
				SetUserID(
					r.Context(),
					claims.UserID,
				),
			)

			next.ServeHTTP(w, r)
		},
	)
}
