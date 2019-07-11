exports.create=function(id,firstName,lastName,hireDate,role,quotes) {
    this.id=id;
    this.firstName=firstName;
    this.lastName=lastName;
    this.hireDate=hireDate;
    this.role=role,
    this.quotes=quotes;

    this.setLastName=function(lastNameData){
        lastName=lastNameData;
    }

    
    this.setFirstName=function(firstNameData){
        firstName=firstNameData;
    }

    
    this.setHireDate=function(hDate){
        hireDate=hDate;
    }

    
    this.setRole=function(roleData){
        role=roleData;
    }
    

}