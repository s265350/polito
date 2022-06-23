﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum CodexInformation {Foro , Santuario , Macellum , ArchiOnorari , TempioDiGiove, TempioDiVespasiano}

public enum Characters {Guardia, Soldato, Schiavo, MySchiavo, Mercante, NobileM, NobileF, Amico, SchiavoTutorial};

public enum Players {Schiavo, Mercante, Nobile};

public enum Missions {Mission1_TalkWithFriend, Mission2_FindSlave, Mission3_GetFood, Mission4_Finale}

public enum MercanteFoodTypes {None, Frutta, Pane, Pesce, Verdura, Vasi}

public enum MaleVoices {Giorgio, Francesco, Antonio, Klajdi, Edoardo, Fabrizio, Andrea}
public enum FemaleVoices {Alessia, Paola}

public enum Inputs { Keyboard, Joystick }
public static class Globals
{
    public static bool hasPlayed = false;
    public static Players player = Players.Nobile;
    public static bool someoneIsTalking = false;
    public static bool earthquake = false;
    public static bool gamePause = false;
    public static string language = "en";
    public static string input = Inputs.Joystick.ToString();
    public static float talkVolume = 1.0f;
    public static float masterVolume = 1.0f;
    public static float sfxVolume = 1.0f;

}

// access variables via Globals.variable