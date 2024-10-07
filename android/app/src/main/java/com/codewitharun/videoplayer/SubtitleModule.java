package com.codewitharun.videoplayer;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.File;

import com.arthenica.mobileffmpeg.FFmpeg;
import com.arthenica.mobileffmpeg.ExecuteCallback;

public class SubtitleModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    SubtitleModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "Subtitles";
    }

    // Method to extract subtitles using FFmpeg
    @ReactMethod
    public void extract(String videoPath, String outputPath, Promise promise) {
        String command = "-i " + videoPath + " -map 0:s:0 " + outputPath;

        FFmpeg.executeAsync(command, new ExecuteCallback() {
            @Override
            public void apply(long executionId, int returnCode) {
                if (returnCode == 0) {
                    promise.resolve("Subtitles extracted successfully: " + outputPath);
                } else {
                    promise.reject("FFmpegError", "Failed to extract subtitles. Return code: " + returnCode);
                }
            }
        });
    }
}

