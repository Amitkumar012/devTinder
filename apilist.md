
# Dev Tinder Apis

authRouter
- Post /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
-PATCH /profile/edit
- PATCH /profile/password // Forget password API
 
 # connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/connections
- Get /user/requests/received
- GET /user/feed - Gets you the profiles of other user on platform




status: ignore, intrested, accepted, rejected