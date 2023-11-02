    private String buildElasticCIndexKey(double dis, double hour) {
        String disSeg;
        if (dis >= 0 && dis < 3) {
            disSeg = "0";
        } else if (dis >= 3 && dis < 5) {
            disSeg = "1";
        } else if (dis >= 5 && dis < 10) {
            disSeg = "2";
        } else if (dis >= 10 && dis < 15) {
            disSeg = "3";
        } else if (dis >= 15 && dis < 20) {
            disSeg = "4";
        } else {
            disSeg = "5";
        }
        String hourSeg;
        if (hour >= 6 && hour < 10) {
            hourSeg = "0";
        } else if (hour >= 10 && hour < 14) {
            hourSeg = "1";
        } else if (hour >= 14 && hour < 17) {
            hourSeg = "2";
        } else if (hour >= 17 && hour < 20) {
            hourSeg = "3";
        } else if (hour >= 20 && hour < 23) {
            hourSeg = "4";
        } else {
            hourSeg = "5";
        }
        return disSeg + "-" + hourSeg;

    }


    private static String judgeCrPeak(String halfHour) {
        if (halfHour.compareTo("07:00:00") >= 0 && halfHour.compareTo("10:00:00") < 0) {
            return "早高峰";
        }
        if (halfHour.compareTo("17:00:00") >= 0 && halfHour.compareTo("20:00:00") < 0) {
            return "晚高峰";
        }
        return "平峰";
    }