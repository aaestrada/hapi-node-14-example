## Node.js and CPU profiling locally with [Clinic js](https://clinicjs.org/documentation/)

Step by step configuration:

1. Install clinic js globally
   `sudo npm install -g clinic`

2. We will execute `autocannon` in the example application directories when we call the `clinic` executable, so let's install it globally, with the following command:
    `sudo npm install -g autocannon`

3. Let's run through the first one using Clinic.js Doctor and autocannon (make sure you are located at `./indexjs` root directory)

    `clinic doctor --autocannon [ /items ] -- node  ./index`

![Screen Shot 2021-10-28 at 17 21 38](https://user-images.githubusercontent.com/88118994/139353414-e7983dcd-59e3-4acd-9b96-a4f7df403f11.png)

4. We can create a Flame profile with a command that is the same as for Doctor, but swapping flame in for doctor:

    `clinic flame --on-port 'autocannon localhost:$PORT/items' -- node ./index` 

![Screen Shot 2021-10-28 at 17 33 23](https://user-images.githubusercontent.com/88118994/139354292-31cca1b2-16fc-442b-881f-63a72e6b9d83.png)

5. We can create a Bubbleprof profile with a command that is the same as for Doctor, but swapping bubbleprof in for doctor: 

    `clinic bubbleprof --on-port 'autocannon localhost:$PORT/items' -- node  ./index` 

![Screen Shot 2021-10-28 at 17 25 55](https://user-images.githubusercontent.com/88118994/139353747-1c97dd6d-9a90-41d0-9666-4ec9aeb0f843.png)