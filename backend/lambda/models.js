exports.Teacher = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "format": "int64"
        },
        "authIdToken": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "phoneNum": {
            "type": "string"
        }
    },
	"additionalProperties": false,
	//if ID is required, it should be excplicitly stated when included.
	"required": ["authIdToken", "name", "email"]
};

exports.Student = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "format": "int64"
        },
        "authIdToken": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "phoneNum": {
            "type": "string"
        }
    },
	"additionalProperties": false,
	//if ID is required, it should be excplicitly stated when included.
	"required": ["authIdToken", "name", "email"]
};
exports.Course = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "format": "int64"
        },
        "name": {
            "type": "string"
        },
        "teacherId": {
            "type": "integer",
            "format": "int64"
        },
        "location": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "startDate": {
            "type": "string",
            "format": "date"
        },
        "endDate": {
            "type": "string",
            "format": "date"
        }
    },
	"additionalProperties": false,
	//if ID is required, it should be excplicitly stated when included.
	"required": ["teacherId", "name", "startDate", "endDate"]
};

exports.Log = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "format": "int64"
        },
        "studentId": {
            "type": "integer",
            "format": "int64"
        },
        "courseId": {
            "type": "integer",
            "format": "int64"
        },
        "time": {
            "type": "string",
            "format": "date-time"
        },
        "messageType": {
            "type": "string"
        },
        "messageReason": {
            "type": "string"
        },
        "value": {
            "type": "integer",
            "format": "int64"
        }
    }
};
