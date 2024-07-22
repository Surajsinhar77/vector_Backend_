class CustomErrorhandler extends Error{

    constructor(status,msg){
      super();
      this.status=status;
      this.message=msg;
    }

    static alreadyExist(message){
        return new CustomErrorhandler(409,message)
    }
  
}

module.exports= CustomErrorhandler;