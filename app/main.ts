import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app.module";

const application = require("tns-core-modules/application");


application.on(application.launchEvent, (args) => {
        // For Android applications, args.android is an android.content.Intent class.
        console.log("launchEvent::Launched Android application with the following intent: " + args.android + ".");
});

application.on(application.suspendEvent, (args) => {
        // For Android applications, args.android is an android activity class.
        console.log("suspendEvent::Activity: " + args.android);
});

application.on(application.resumeEvent, (args) => {
        // For Android applications, args.android is an android activity class.
        console.log("resumeEvent::Activity: " + args.android);
});

application.on(application.displayedEvent, (args) => {
    // args is of type ApplicationEventData
    console.log("displayedEvent::displayedEvent");
});

application.on(application.orientationChangedEvent, (args) => {
    // args is of type OrientationChangedEventData
    console.log("orientationChangedEvent:: " + args.newValue); // "portrait", "landscape", "unknown"
});


application.on(application.exitEvent, (args) => {
        // For Android applications, args.android is an android activity class.
        console.log("exitEvent::Activity: " + args.android);
        if (args.android.isFinishing()) {
            console.log("exitEvent::Activity: " + args.android + " is exiting");
        } else {
            console.log("exitEvent::Activity: " + args.android + " is restarting");
        }
});

application.on(application.lowMemoryEvent, (args) => {
        // For Android applications, args.android is an android activity class.
        console.log("lowMemoryEvent::Activity: " + args.android);
});

application.on(application.uncaughtErrorEvent, (args) => {
    console.log("uncaughtErrorEvent::Error: " + args.error);
});

platformNativeScriptDynamic().bootstrapModule(AppModule);
