
const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns")

const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("44 22 * * *", async () => {
    

    try{

        const yesterday = subDays(new Date(), 0);

        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req=> req.toUserId.emailId))]

        console.log(listOfEmails)

        for(const email of listOfEmails) {
            try{
                const res = await sendEmail.run(
                    "New friend request pending for " + email,
                    "There are so many request pending please login"
                );
                console.log(res)

            }
            catch(err){
                console.error(err);
            }


        }

    }
    catch (err) {
        console.error(err);
    }

});