// JavaScript File
/*global d3*/
/*global NodeText*/
/*global Node*/
/*global mainSvg*/
/*global width*/
/*global height*/
/*global padding*/
/*global SingleState*/
/*global Connector*/

class Stack
{
    constructor(customValues) {
        this.dataset = [];
        this.Nodes = [];
        this.States = [];
        this.UIOptions = [];
        
        this.maxNodes = 10;
        this.ContainerNodes = 1;
        this.nodeWidth = 80;
        this.nodeHeight = (height - 50) / this.maxNodes;
        this.topPadding = this.nodeHeight * 2;
        this.xCenter = (width / 2) - (this.nodeWidth/2);
        
        this.dataset = ProcessInput(customValues, 3);
        this.init();
        this.UpdateUIOptions();
    }
    
    UpdateUIOptions() {
        this.UIOptions.push({
                'name': 'Create', 
                'type': 'Input', 
                'inputs': ['Values']
            },
                {'name': 'Push', 
                'type': 'Input-Event', 
                'inputs': ['Value']
            },
                {'name': 'Pop', 
            },
                {'name': 'Peek', 
            },
                {'name': 'isEmpty', 
            });
    }
    
    init() {
        var nodes = this.dataset.length;
        
        if(CheckForMaxNodes(0, nodes, this.maxNodes)) {
            return;
        }
        
        for(var kk = 0; kk < this.dataset.length; kk++) {
            if(IsInvalidNumber(this.dataset[kk])) {
                return;
            }
        }
        
        var container = new Node();
        container.x = this.xCenter - 5;
        container.y = this.topPadding;
        container.color = "blue";
        container.width = 2;
        container.type = "path";
        container.path = "";
        container.path += " M " + container.x + " " + container.y;
        container.path += " V " + height;
        container.path += " H " + (container.x + this.nodeWidth + 10);
        container.path += " V " + container.y;
        container.id = "stackContainer";
        
        this.Nodes.push(container);
        
        var offset = height - this.nodeHeight - 5;
        
        for(var i = 0; i<nodes; i++)
        {
            var n = new Node();
            n.x = this.xCenter;
            n.y = offset;
            n.color = "orange";
            n.width = this.nodeWidth;
            n.height = this.nodeHeight;
            n.id = "node-" + i;
            
            n.text.value = this.dataset[i];
            n.text.color = "black";
            n.text.font = "sanserif";
            n.text.size = "14";
            n.text.x = (this.xCenter + this.nodeWidth / 2);
            n.text.y = n.y + this.nodeHeight / 2 + 5;
            n.text.id = "tbar-" + i;
            
            this.Nodes.push(n);
            
            offset = offset - this.nodeHeight - 5;
        }
    }
    
    ProcessAction(idx, inputs) {
        if(this.UIOptions[idx].name == "Create") {
            return true;
        }
        else if(this.UIOptions[idx].name == "Push") {
            return this.Push(parseInt(inputs[0]));
        } else if(this.UIOptions[idx].name == "Pop") {
            return this.Pop();
        }else if(this.UIOptions[idx].name == "Peek") {
            return this.Peek();
        }else if(this.UIOptions[idx].name == "isEmpty") {
            return this.isEmpty();
        }
    }
    
    CreateNewNode(number) {
        var n = new Node();
        n.x = this.xCenter;
        n.y = this.topPadding * 0.25;
        n.color = "DodgerBlue";
        n.width = this.nodeWidth;
        n.height = this.nodeHeight;
        n.id = "node-" + this.Nodes.length;
            
        n.text.value = number;
        n.text.color = "black";
        n.text.font = "sanserif";
        n.text.size = "14";
        n.text.x = (this.xCenter + this.nodeWidth / 2);
        n.text.y = n.y + this.nodeHeight / 2 + 5;
        n.text.id = "tbar-" + this.Nodes.length;
            
        this.Nodes.push(n);
        
        var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++)
        {
          state.AddANode(this.Nodes[i]);
          state.Nodes[i].isUpdated = true;
        }
        state.text = "New value to push is   "+ n.text.value;
        this.States.push(state);
    }
    
    InsertInitialState() {
        //insert a state
        var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++)
        {
          state.AddANode(this.Nodes[i]);
          state.Nodes[i].isUpdated = true;
        }
        state.text = "Initial stack values.";
        this.States.push(state);
    }
    
    InsertStateToPush() {
        var idx = this.Nodes.length - 1;
        this.Nodes[idx].y = this.Nodes[idx - 1].y - this.nodeHeight - 5;
        this.Nodes[idx].text.y = this.Nodes[idx].y + this.nodeHeight / 2 + 5;
        //insert a state
        var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++)
        {
          state.AddANode(this.Nodes[i]);
          state.Nodes[i].isUpdated = true;
        }
        state.text = "Adding new value "+ this.Nodes[idx].text.value + " to the top of the stack";
        this.States.push(state);
    }
    
    InsertFinalState() {
        var idx = this.Nodes.length - 1;
        this.Nodes[idx].color = "orange";
        
        //insert a state
        var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++)
        {
          state.AddANode(this.Nodes[i]);
          state.Nodes[i].isUpdated = true;
        }
        state.text = "Final state of Stack";
        this.States.push(state);
    }
    
    selectDeletedNode() {
         var n = this.Nodes[this.Nodes.length-1];
         n.color = "DodgerBlue";
         var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++)
        {
          state.AddANode(this.Nodes[i]);
          state.Nodes[i].isUpdated = true;
        }
        state.text = "Select top of the stack, value is   "+n.text.value;
        this.States.push(state);
    }
    
     InsertStateToPop() {
        var idx = this.Nodes.length - 1;
        
        this.Nodes[idx].y =  this.topPadding * 0.25;
        this.Nodes[idx].text.y = this.Nodes[idx].y + this.nodeHeight / 2 + 5;
        
        //insert a state
        var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++)
        {
          state.AddANode(this.Nodes[i]);
          state.Nodes[i].isUpdated = true;
        }
         state.text = "Removing the value "+this.Nodes[idx].text.value + " from the stack";
        this.States.push(state);
    }
    
    deleteFinalState(){
        var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++)
        {
            var val = this.Nodes[i];
           
          state.AddANode(this.Nodes[i]);
          state.Nodes[i].isUpdated = true;
          if(i == this.Nodes.length-1) {
              state.Nodes[i].isDelete = true;
          }
        }
        state.text = "Final state of the stack";
        this.Nodes.pop();
         
        this.States.push(state);
        
    }
    
    Push(number) {
        if(CheckForMaxNodes(this.Nodes.length - this.ContainerNodes, 1, this.maxNodes)) {
            return false;
        }
        
        if(IsInvalidNumber(number)) {
            return false;
        }
        
        this.States.splice(0, this.States.length);
        
        this.InsertInitialState();
        
        this.CreateNewNode(number);
        
        this.InsertStateToPush();
        
        this.InsertFinalState();
        
        return true;
    }
    
    Pop(){
        
        this.States.splice(0, this.States.length);
        
        this.InsertInitialState();
        
        if(this.Nodes.length != this.ContainerNodes) {
            
            this.selectDeletedNode();

            this.InsertStateToPop();

            this.deleteFinalState();
        }
        else {
            var st = new SingleState();
            st.text = "Stack is already emtpy!!!";
            this.States.push(st);
        }
        return true;
    }
    
    Peek(){
        this.States.splice(0, this.States.length);
        
        this.InsertInitialState();
        if(this.Nodes.length != this.ContainerNodes) {
            
            this.selectDeletedNode();
        
            this.InsertFinalState();
            
            this.States[this.States.length - 1].text = "The top of the stack is " + this.Nodes[this.Nodes.length - 1].text.value;
        }
        else {
            var st = new SingleState();
            st.text = "Stack is already emtpy!!!";
            this.States.push(st);
        }       
        return true;
    }
    
    isEmpty(){
        this.States.splice(0, this.States.length);
        
        var nodeSize = this.Nodes.length - this.ContainerNodes;
        
        var state = new SingleState();
        for(var i = 0; i < this.Nodes.length; i++) {
            var val = this.Nodes[i];
            state.AddANode(this.Nodes[i]);
            state.Nodes[i].isUpdated = true;
        }
        
        if(nodeSize <= 0){
             state.text = "Stack is empty";
        }else{
            state.text = "Size of stack is  "+ nodeSize;
        }
        
        this.States.push(state);
        
        return true;
    }
}