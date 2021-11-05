## Node.js and CPU profiling locally with [Clinic js](https://clinicjs.org/documentation/)

Step by step configuration:

1. Install clinic js globally
   `sudo npm install -g clinic`

2. We will execute `autocannon` in the example application directories when we call the `clinic` executable, so let's install it globally, with the following command:
    `sudo npm install -g autocannon`

3. Let's run through the first one using Clinic.js Doctor and autocannon (make sure you are located at `./indexjs` root directory)

    `clinic doctor --autocannon [ /items ] -- node  ./index`

![Screen Shot 2021-11-04 at 9 56 26](https://user-images.githubusercontent.com/88118994/140384214-e81a2898-d163-461f-8a1d-051f243be169.png)


4. We can create a Flame profile with a command that is the same as for Doctor, but swapping flame in for doctor:

    `clinic flame --on-port 'autocannon localhost:$PORT/items' -- node ./index` 

![Screen Shot 2021-11-04 at 9 57 26](https://user-images.githubusercontent.com/88118994/140384414-c445f678-2383-4a59-8086-c074a32f16a0.png)


5. We can create a Bubbleprof profile with a command that is the same as for Doctor, but swapping bubbleprof in for doctor: 

    `clinic bubbleprof --on-port 'autocannon localhost:$PORT/items' -- node  ./index` 

![Screen Shot 2021-11-04 at 9 58 41](https://user-images.githubusercontent.com/88118994/140384623-fc8a5d54-5fc6-405b-92eb-689db7fb3112.png)
