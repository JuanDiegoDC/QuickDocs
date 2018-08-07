import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const documentSchema = new Schema({
  collaborators: {
    type: Array,
    required: true
  },
  owner: {
    type: ObjectId,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Document = mongoose.model("Document", documentSchema);

export default Document;
