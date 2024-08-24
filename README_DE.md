# Tachometer

In dieser Übung nutzt ihr useReducer um ein Auto-Tachometer zu bauen.

Das Auto hat zwei Zustandsvariablen zu steuern:

- gestartet
- Tempo

Das Auto hat folgende Funktionen:

- anschalten/ausschalten
- beschleunigen
- bremsen

## Anforderungen

- Beim Beschleunigen wird das Tempo um 5 km/h erhöht
- Beim Bremsen wird das Tempo um 5km/h verringert
- Beschleunigen ist nur bei einem angeschalteten Auto möglich
- Ausschalten ist nur möglich, wenn das Auto steht (0km/h)
- Ein Auto kann keine negativen km/h fahren
- Kein `useState`

Verwende das [react-d3-speedometer](https://www.npmjs.com/package/react-d3-speedometer) npm-Paket, um den Tachometer zu erstellen.

## Bonus-Herausforderung

- Beschleunigen und Bremsen durch gedrückt halten der Tasten statt Klicken
- Zeige die zurückgelegte Strecke an

## Beispielbilder

### Ausgeschalteter Modus

![](/images/switched-off.png)

### Eingeschalteter Modus

![](/images/switched-on.png)
