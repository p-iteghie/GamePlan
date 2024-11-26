const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        location: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        attendees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;