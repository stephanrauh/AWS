package com.myorg;

import software.amazon.awscdk.core.App;

public final class JavaSampleAppApp {
    public static void main(final String[] args) {
        App app = new App();

        new JavaSampleAppStack(app, "JavaSampleAppStack");

        app.synth();
    }
}
