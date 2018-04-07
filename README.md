# ryobiGDO
Ryobi Garage Door opener for Smartthings

I CLAIM NO CREDIT FOR THIS. I SIMPLY ADDED A README, CHANGED A FEW THINGS AND ADDED IT TO GITHUB FOR MY OWN DOCUMENTATION
madj42 did all the work on this! https://community.smartthings.com/u/madj42

Quick and dirty setup:

1: Install Node.js on a device of your choice (RPi, old phone, etc)
2: Install request, ws and resolve with npm for node.js
3: Add RyobiGDOProxy.js to your node server (Edit the variables at the top of the file!)
4: Set RyobiGDOProxy.js to run 24/7
5: Add Ryobi_GDO200_DH.groovy as a device handler in smartthings
6: Add a custom device from the 'devices' page in the smartthings IDE, being sure to set the Device Network ID to a hex version of your NODE PROXY IP! Use this to convert: https://ncalculators.com/digital-computation/ip-address-hex-decimal-binary.htm .An example would be: 0A00079A:0BE2 (Note the last 4 is the port. It must be 4 digits)
7: All done! Test!
