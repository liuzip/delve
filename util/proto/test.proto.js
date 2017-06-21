var Root  = protobuf.Root,
    Type  = protobuf.Type,
    Field = protobuf.Field;

var testMessage = new Type("testModel");
testMessage.add(new Field("name", 1, "string"));
testMessage.add(new Field("age", 2, "int32"));
testMessage.add(new Field("male", 3, "bool"));

var Message = new Root().define("test").add(testMessage);
var TestModel = Message.lookupType("test.testModel");
