﻿using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityStandardAssets.CrossPlatformInput;

public class TutorialManager : MonoBehaviour
{

    [SerializeField] private BoxCollider _collider;

    private TextMeshProUGUI _tutorialText;
    private NpcTutorial _schiavo;
    private ShowAgenda _scriptAgenda;
    private float _waitTime = 1f;
    private int _missionIndex;
    private MissionManager _activateMission;

    private void Start()
    {
        _tutorialText = FindObjectOfType<TutorialText>().GetComponent<TextMeshProUGUI>();
        _schiavo = FindObjectOfType<NpcTutorial>();
        _scriptAgenda = FindObjectOfType<ShowAgenda>();
        _scriptAgenda.enabled = false;
        _missionIndex = 0;
        if(Globals.language == "en")
        {
            if (Globals.input == Inputs.Joystick.ToString()) _tutorialText.text = "Move around with your LSB and walk with RSB. Run with RT.";
            else _tutorialText.text = "Move around with your mouse and walk using WASD button. Run with Shift button";
        }
        else
        {
            if (Globals.input == Inputs.Keyboard.ToString()) _tutorialText.text = "Muoviti nell'ambiente usando il mouse e cammina usando i tasti WASD. Corri premendo il tasto Shift.";
            else _tutorialText.text = "Muoviti nell'ambiente usando LSB e cammina con RSB. Corri con RT.";
        }
        _activateMission = FindObjectOfType<MissionManager>();
       // _activateMission.enabled = false;

    }
    private void Update()
    {
        if(_schiavo == null) _schiavo = FindObjectOfType<NpcTutorial>();
        switch(_missionIndex)
        {
            case 0:
                CheckWalk();
                break;
            case 1:
                CheckPointing();
                break;
            case 2:
                CheckInteraction();
                break;
            case 3:
                CheckMappa();
                break;
            case 4:
                PutDownMappa();
                break;
            //case 5:
            //    CheckCodex();
            //    break;
            //case 6:
            //    FinishTutorial();
            //    break;
            default: throw new System.ArgumentOutOfRangeException();
        }
    }

    private void CheckWalk()
    {
        //if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.D))
        //if()
        if(CrossPlatformInputManager.GetAxis("MoveVertical")!= 0 ||
           CrossPlatformInputManager.GetAxis("MoveHorizontal")!= 0 ||
           CrossPlatformInputManager.GetAxis("Horizontal") != 0 ||
           CrossPlatformInputManager.GetAxis("Vertical") != 0)
        {
            _missionIndex = 1;
            //_tutorialText.text = "";
        }
        
    }

    private void CheckPointing()
    {
        if (_waitTime <= 0)
        {
            if (Globals.language == "en")
            {
                _tutorialText.text = "Interact with objects and people by pressing the showing button";
            }
            else
            {
                _tutorialText.text = "Interagisci con oggetti e personaggi premendo il tasto indicato";
            }
            _missionIndex = 2;
        }
        else
        {
            _waitTime -= Time.deltaTime;
        }
        
    }

    private void CheckInteraction()
    {
        if (_schiavo.pointingSchiavo && !_schiavo.hasTalked)
        {
            _tutorialText.text = "";
        }
        if(_schiavo.hasTalked)
        {
            _collider.enabled = false;
            if (Globals.language == "it")
            {
                _tutorialText.text = "Premi  <sprite index= 0> per visualizzare la mappa";
            }
            else
            {
                _tutorialText.text = "Press  <sprite index= 0> to view the map";
            }
            _activateMission.UpdateMission(Missions.Mission1_TalkWithFriend);
            _scriptAgenda.enabled = true;
            _missionIndex = 3;
        }
    }
    
    private void CheckMappa()
    {
        if (Input.GetButtonDown("Map"))
        {
            if (Globals.language == "it")
            {
                _tutorialText.text = "Quì vengono mostrati i punti di interesse per i vari obiettivi. Premi nuovamente <sprite index= 0> per chiudere la mappa";

            }
            else
            {
                _tutorialText.text = "In this section you will see where to go for the various goals. Press again <sprite index= 0> to close the map.";
            }
            _missionIndex = 4;
        }
    }
    private void PutDownMappa()
    {
        if (Input.GetButtonDown("Map"))
        {
            _tutorialText.enabled = false;
            this.enabled = false;
        }
        
    }

    //private void CheckCodex()
    //{
    //    if (Input.GetKeyDown(KeyCode.C))
    //    {
    //        _tutorialText.text = "Alcuni monumenti presenti nell'ambiente contengono informazioni storiche. Quando ci passi vicino, queste informazioni verranno salvate in questa sezione.";
    //        _missionIndex = 6;
    //    }
    //}

    //private void FinishTutorial()
    //{
    //    if (Input.GetKeyDown(KeyCode.C))
    //    {
    //        _tutorialText.enabled = false;
    //        this.enabled = false;
    //    }
    //}
}
